package edu.ucsb.cs156.example.entities;

import javax.persistence.Entity;
import javax.persistence.Id;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "restaurants")
public class Restaurant {
  @Id
  private String code;
  private String name;
  private boolean hasTakeOutMeal;
  private Double latitude;
  private Double longitude;
}